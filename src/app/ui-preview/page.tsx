"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";

const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

export default function UIPreview() {
  const [email, setEmail] = useState("");
  const [decision, setDecision] = useState<"approved" | "denied" | null>(null);
  const [day, setDay] = useState("Mon");

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
    </div>
  );
}
