export interface AppShellProps {
  role: "volunteer" | "admin";
  children: React.ReactNode;
}

export default function AppShell(props: AppShellProps) {
  const { role, children } = props;

  return (
    <div data-stub="AppShell" style={{ border: "1px dashed #bbb", padding: 8 }}>
      <div>AppShell · role: {role}</div>
      {children}
    </div>
  );
}
