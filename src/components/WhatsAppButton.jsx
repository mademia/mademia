export default function WhatsAppButton({ href, label = 'Consultar por WhatsApp', className = '', block = false }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`btn btn-whatsapp ${block ? 'btn-block' : ''} ${className}`}
    >
      <span aria-hidden="true">💬</span> {label}
    </a>
  )
}
