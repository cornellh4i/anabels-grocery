"use client";
export interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  footer?: React.ReactNode; // action buttons slot
  children?: React.ReactNode; // body
}

export default function Modal(props: ModalProps) {
  if (!props.open) {
    return null;
  }

  return (
    <div
      data-stub="ModalOverlay"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.20)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <section
        data-stub="Modal"
        style={{
          display: "flex",
          width: "568px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "10px",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            padding: "20px 35px 10px",
          }}
        >
          <h2 style={{ margin: 0 }}>{props.title ?? "Modal placeholder"}</h2>

          <button
            aria-label="Close modal"
            onClick={props.onClose}
            style={{
              width: "12.8px",
              height: "12.8px",
              padding: 0,
              border: "none",
              background: "transparent",
              color: "#4E4E4E",
              cursor: "pointer",
              lineHeight: "12.8px",
            }}
          >
            ×
          </button>
        </header>

        <div style={{ padding: "0 35px 20px", alignSelf: "stretch" }}>
          {props.children}
        </div>

        {props.footer && (
          <footer
            style={{
              display: "flex",
              height: "63px",
              padding: "10px 35px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: "10px",
              alignSelf: "stretch",
              borderRadius: "0 0 8px 8px",
              borderRight: "1px solid #D4D0D0",
              borderBottom: "1px solid #D4D0D0",
              borderLeft: "1px solid #D4D0D0",
              background:
                "linear-gradient(0deg, rgba(217, 217, 217, 0.35) 0%, rgba(217, 217, 217, 0.35) 100%), #FFF",
            }}
          >
            {props.footer}
          </footer>
        )}
      </section>
    </div>
  );
}
