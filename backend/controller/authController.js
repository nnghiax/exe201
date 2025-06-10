const User = require('../model/User')
const bcrypt = require('bcryptjs')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GG_CLIENT_ID);
require('dotenv').config()
const sendMail = require('./sendMail')


const authController = {

    registerUser: async (req, res) => {
        try {
            const { name, email, password, confirmPassword } = req.body

            if (!name || !email || !password || !confirmPassword) {
                return res.status(400).json({ message: 'Please fill all fields' })
            }

            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email' });
            }

            const normalizedEmail = email.trim().toLowerCase();
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' })
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Password do not match' })
            }

            const hashdPassword = await argon2.hash(password)
            const newUser = new User({ name, email: normalizedEmail, password: hashdPassword })
            await newUser.save()
            await sendMail({
                email: email,
                subject: "Chào mừng bạn đến với Hire Your Style!",
                html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #4CAF50;">Chúc mừng bạn đã đăng ký thành công!</h2>
            <p>Xin chào <strong>${name}</strong>,</p>
            <p>Cảm ơn bạn đã quan tâm và đăng ký tài khoản trên hệ thống <strong>Hire Your Style</strong>.</p>
            <p>Thông tin tài khoản của bạn:</p>
            <ul>
                <li><strong>Họ và tên:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
            </ul>
            <p>Chúng tôi rất mong được đồng hành cùng bạn trong hành trình trải nghiệm thời trang độc đáo và phong cách.</p>
            <p>Trân trọng,<br>Đội ngũ Hire Your Style</p>
        </div>
    `
            })
            return res.status(201).json({ message: 'Register user successfully' })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({ message: 'Please fill all fields' })
            }

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: 'Email or password is incorrect' })
            }

            const validPassword = await argon2.verify(user.password, password)
            if (!validPassword) {
                return res.status(400).json({ message: 'Email or password is incorrect' })
            }

            const accessToken = await jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            return res.status(200).json({ message: 'Login successfully', user, accessToken })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    googleLogin: async (req, res) => {
        try {
            const { credential } = req.body;
            if (!credential) {
                return res.status(400).json({ message: 'Missing Google credential' });
            }

            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GG_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { email, name, picture, sub } = payload;

            const normalizedEmail = email.trim().toLowerCase();
            let user = await User.findOne({ email: normalizedEmail });

            if (!user) {
                user = new User({
                    name,
                    email: normalizedEmail,
                    password: await argon2.hash(sub),
                    avatar: picture || '',
                    address: {
                        street: '',
                        ward: '',
                        district: '',
                        city: ''
                    }
                });
                await user.save();
            }

            const accessToken = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            res.status(200).json({ message: 'Google login successful', user, accessToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Google login failed', error: error.message });
        }
    },


    forgotPassword: async (req, res) => {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found' });

        const otp = Math.floor(100000 + Math.random() * 900000);

        otpStore[email] = {
            code: otp,
            expiresAt: Date.now() + 5 * 60 * 1000
        }

        await sendMail({
            email,
            subject: 'Mã OTP khôi phục mật khẩu',
            html: `
                <h3>Xin chào ${user.name}</h3>
                <p>Mã OTP của bạn là:</p>
                <h2>${otp}</h2>
                <p>Mã có hiệu lực trong 5 phút.</p>
            `
        })
        return res.json({ message: 'OTP has been sent to your email' });
    },

    verifyOtp: async (req, res) => {
        const { email, otp, newPassword, confirmPassword } = req.body;

        const record = otpStore[email];
        if (!record) return res.status(400).json({ message: 'OTP not found or expired' });
        if (Date.now() > record.expiresAt) return res.status(400).json({ message: 'OTP expired' });
        if (parseInt(otp) !== record.code) return res.status(400).json({ message: 'Invalid OTP' });

        if (newPassword !== confirmPassword)
            return res.status(400).json({ message: 'Passwords do not match' });

        const hashed = await argon2.hash(newPassword);
        await User.findOneAndUpdate({ email }, { password: hashed });

        delete otpStore[email];

        return res.json({ message: 'Password updated successfully' });
    }

}

module.exports = authController