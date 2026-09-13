import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const { error } = await signIn(email, password)
    if (error) setError('Credenciales incorrectas')
    else navigate('/admin')
  }

  return (
    <div className="container section" style={{ maxWidth: 420 }}>
      <h1 className="section-title">Ingresar</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
        <button className="btn btn-primary btn-block" type="submit">Ingresar</button>
      </form>
    </div>
  )
}
