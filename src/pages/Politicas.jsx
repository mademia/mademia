export default function Politicas() {
  return (
    <div className="container section" style={{ maxWidth: 760 }}>
      <h1 className="section-title">Envíos y devoluciones</h1>

      <h2 style={{ fontSize: '1.3rem', marginTop: 32, marginBottom: 12 }}>Envíos</h2>
      <p>
        Los pedidos se entregan a través de un servicio de transporte contratado.
        En compras desde Bs 4000, el envío está incluido sin costo adicional.
        Para compras por debajo de ese monto, el costo de envío se calcula según
        la zona de entrega y se confirma contigo por WhatsApp antes de despachar
        tu pedido.
      </p>
      <p>
        El tiempo de entrega se coordina por WhatsApp una vez confirmado tu
        pedido, según la disponibilidad del transporte y tu zona.
      </p>

      <h2 style={{ fontSize: '1.3rem', marginTop: 32, marginBottom: 12 }}>Devoluciones y garantía</h2>
      <p>
        Nuestros muebles son productos terminados, con medidas y acabados
        finales tal como se muestran en cada ficha de producto. Aceptamos
        devoluciones o cambios <strong>únicamente por defectos de fabricación</strong>
        {' '}(problemas de material, acabado o estructura) — no aplicamos
        devoluciones por cambio de opinión.
      </p>
      <p>
        Si tu mueble presenta un defecto de fabricación, contáctanos por
        WhatsApp dentro de los <strong>7 días posteriores a la entrega</strong>,
        indicando tu número de pedido y adjuntando fotos o video del defecto.
        Evaluaremos cada caso para ofrecer reparación, cambio de la pieza o
        reembolso, según corresponda.
      </p>

      <p style={{ marginTop: 32, fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
        Esta política no reemplaza los derechos que te reconoce la normativa
        boliviana de protección al consumidor. Ante cualquier duda, contáctanos
        por WhatsApp.
      </p>
    </div>
  )
}
