"use client";

import { useState } from "react";
import { Button, Card, Checkbox, Input, Select, StatusPill, useToast } from "@/components/ui";

const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

export default function UIPreview() {
  const [email, setEmail] = useState("");
  const [decision, setDecision] = useState<"approved" | "denied" | null>(null);
  const [day, setDay] = useState("Mon");
  const [shift, setShift] = useState("stocking");
  const [checked, setChecked] = useState(false);
  const { toast } = useToast();
  const options = [
    { label: "Stocking", value: "stocking" },
    { label: "Open hours", value: "open" },
    { label: "Closing", value: "closing" },
  ];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 text-black">
      <h1 className="text-2xl font-semibold">UI preview</h1>

      <section className="space-y-3">
        <h2 className="font-semibold">Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Submit</Button>
          <Button>Submit</Button>
          <Button variant="submitted" />
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Delete</Button>
          <Button variant="ghost">Back</Button>
          <Button size="sm">Small</Button>
          <Button loading>Save</Button>
        </div>
        <Button fullWidth>Full width</Button>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Approve / deny — click again to undo</h2>
        <div className="flex gap-3">
          <Button variant={decision === "approved" ? "approved" : "approve"}
            onClick={() => setDecision(decision === "approved" ? null : "approved")} />
          <Button variant={decision === "denied" ? "denied" : "deny"}
            onClick={() => setDecision(decision === "denied" ? null : "denied")} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Days</h2>
        <div role="group" aria-label="Day of week" className="flex flex-wrap gap-3">
          {days.map(name => (
            <Button key={name} variant={day === name ? "day-active" : "day"}
              onClick={() => setDay(name)}>{name}</Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="day">Outline</Button>
          <Button variant="day-active">Selected</Button>
          <Button variant="day-muted">Muted</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Card and inputs</h2>
        <Card>
          <h3 className="text-xl font-semibold">Example card</h3>
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="With error" value={email} onChange={setEmail} error="Please enter a valid email." />
          <Input label="Disabled" value="Unavailable" onChange={() => {}} disabled />
        </Card>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Select and checkbox</h2>
        <Card>
          <Select label="Shift type" value={shift} onChange={setShift} options={options} />
          <Select label="Invalid shift" value={shift} onChange={setShift} options={options} error="Choose an available shift." />
          <Select label="Disabled shift" value={shift} onChange={setShift} options={options} disabled />
          <Checkbox label="Include stocking shifts" value={checked} onChange={setChecked} />
          <Checkbox label="Accept shift requirements" value={checked} onChange={setChecked} error={checked ? undefined : "Please accept the requirements."} />
          <Checkbox label="Disabled unchecked" value={false} onChange={() => {}} disabled />
          <Checkbox label="Disabled checked" value={true} onChange={() => {}} disabled />
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Status pills</h2>
        <div className="flex flex-wrap items-center gap-3">
          {(["completed", "present", "absent", "late", "excused", "low-staffed"] as const).map((variant) => (
            <StatusPill key={variant} variant={variant} />
          ))}
          <StatusPill variant="completed">Custom label</StatusPill>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Toasts</h2>
        <p className="text-sm text-text-soft">Dismiss manually or wait five seconds. Hover or focus pauses dismissal.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => toast({ type: "success", message: "Shift saved." })}>Success toast</Button>
          <Button variant="danger" onClick={() => toast({ type: "error", message: "Unable to save the shift. Please try again." })}>Error toast</Button>
          <Button variant="secondary" onClick={() => toast({ type: "info", message: "The schedule has been updated." })}>Info toast</Button>
        </div>
      </section>
    </div>
  );
}
