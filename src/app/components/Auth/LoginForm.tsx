import React from 'react'
import { useForm } from '@/app/hooks/useForm'
import { useAuth } from '@/app/context/AuthContext'
import AuthForm from './AuthForm'

interface LoginFormProps {
    onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
    const { login, loading } = useAuth()
    const { values, errors, handleChange, setFieldError, reset } = useForm({
        username: '',
        password: '',
    })

    const validate = () => {
        let valid = true
        if (!values.username) {
            setFieldError('username', '아이디를 입력하세요.')
            valid = false
        }
        if (!values.password) {
            setFieldError('password', '비밀번호를 입력하세요.')
            valid = false
        }
        return valid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        try {
            await login(values.username, values.password)
            reset()
            if (onSuccess) onSuccess()
        } catch (err: any) {
            alert(err?.response?.data?.message || '로그인 실패')
        }
    }

    return (
        <AuthForm
            title='로그인'
            onSubmit={handleSubmit}
            submitLabel='로그인'
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
                    name: 'password',
                    type: 'password',
                    placeholder: '비밀번호',
                    value: values.password,
                    onChange: handleChange,
                    error: errors.password,
                },
            ]}
        />
    )
}
