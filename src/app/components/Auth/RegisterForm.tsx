import React from 'react'
import { useForm } from '@/app/hooks/useForm'
import { useAuth } from '@/app/context/AuthContext'
import AuthForm from './AuthForm'

interface RegisterFormProps {
    onSuccess?: () => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
    const { register, loading } = useAuth()
    const { values, errors, handleChange, setFieldError, reset } = useForm({
        username: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const validate = () => {
        let valid = true
        if (!values.username) {
            setFieldError('username', '이름을 입력하세요.')
            valid = false
        }

        if (!values.nickname) {
            setFieldError('nickname', '닉네임을 입력하세요.')
            valid = false
        }

        if (!values.email || !/^[^@]+@[^@]+\.[^@]+$/.test(values.email)) {
            setFieldError('email', '유효한 이메일을 입력하세요.')
            valid = false
        }

        if (values.password !== values.confirmPassword) {
            setFieldError('confirmPassword', '비밀번호가 일치하지 않습니다.')
            valid = false
        }
        return valid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        try {
            await register({
                username: values.username,
                nickname: values.nickname,
                email: values.email,
                password: values.password,
            })
            alert('회원가입이 완료되었습니다. 로그인 해주세요.')
            reset()
            if (onSuccess) onSuccess()
        } catch (err: any) {
            alert(err?.response?.data?.message || '회원가입 실패')
        }
    }

    return (
        <AuthForm
            title='회원가입'
            onSubmit={handleSubmit}
            submitLabel='회원가입'
            loading={loading}
            fields={[
                {
                    name: 'username',
                    placeholder: '아이디',
                    value: values.username,
                    onChange: handleChange,
                    error: errors.username,
                },
                {
                    name: 'nickname',
                    placeholder: '닉네임',
                    value: values.nickname,
                    onChange: handleChange,
                    error: errors.nickname,
                },
                {
                    name: 'email',
                    placeholder: '이메일',
                    value: values.email,
                    onChange: handleChange,
                    error: errors.email,
                },
                {
                    name: 'password',
                    type: 'password',
                    placeholder: '비밀번호',
                    value: values.password,
                    onChange: handleChange,
                    error: errors.password,
                },
                {
                    name: 'confirmPassword',
                    type: 'password',
                    placeholder: '비밀번호 확인',
                    value: values.confirmPassword,
                    onChange: handleChange,
                    error: errors.confirmPassword,
                },
            ]}
        />
    )
}
