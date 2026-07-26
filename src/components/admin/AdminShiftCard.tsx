export interface AdminShiftCardAssignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface AdminShiftCardProps {
  committee: string;
  time: string;
  filled: number;
  capacity: number;
  variant: "normal" | "low-staffed";
  assignees: AdminShiftCardAssignee[];
  overflowCount?: number;
  maxAvatars?: number;
  className?: string;
}

const VARIANT_STYLES: Record<AdminShiftCardProps["variant"], string> = {
  normal: "bg-[#fff9d5]",
  "low-staffed": "border-l-[3px] border-brand-red bg-brand-light-red",
};

function initialsOf(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function AvatarChip({ assignee }: { assignee: AdminShiftCardAssignee }) {
  if (assignee.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={assignee.avatarUrl}
        alt={assignee.name}
        className="size-[26px] shrink-0 rounded-full object-cover ring-2 ring-white"
      />
    );
  }

  return (
    <div
      className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-brand-shift-text ring-2 ring-white"
      title={assignee.name}
    >
      {initialsOf(assignee.name)}
    </div>
  );
}

export default function AdminShiftCard(props: AdminShiftCardProps) {
  const maxAvatars = props.maxAvatars ?? 3;
  const visibleAssignees = props.assignees.slice(0, maxAvatars);
  const overflowCount =
    props.overflowCount ?? Math.max(0, props.assignees.length - maxAvatars);

  return (
    <div
      className={`flex size-full flex-col justify-between gap-2 rounded-lg p-3 ${VARIANT_STYLES[props.variant]} ${props.className ?? ""}`}
    >
      <div className="flex min-w-0 flex-col">
        <p className="truncate font-jakarta text-sm font-semibold text-black">
          {props.committee}
        </p>
        <p className="truncate font-jakarta text-xs text-black">{props.time}</p>
        {props.variant === "low-staffed" ? (
          <p className="truncate font-jakarta text-[10px] font-semibold text-brand-red">
            {props.filled}/{props.capacity} filled
          </p>
        ) : null}
      </div>

      {props.assignees.length > 0 ? (
        <div className="flex shrink-0 items-center -space-x-2">
          {visibleAssignees.map((assignee) => (
            <AvatarChip key={assignee.id} assignee={assignee} />
          ))}
          {overflowCount > 0 ? (
            <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-brand-soft-text ring-2 ring-white">
              +{overflowCount}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
