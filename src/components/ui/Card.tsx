export interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Card(props: CardProps) {
  return (
    <div
      data-stub="Card"
      className={props.className}
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "568px",
        flexDirection: "column",
        alignItems: "flex-start",
        border: "1px dashed #bbb",
        borderRadius: "8px",
        padding: "16px",
        background: "#fff",
      }}
    >
      <div style={{ fontSize: "12px", opacity: 0.6 }}>Card placeholder</div>
      {props.children}
    </div>
  );
}
