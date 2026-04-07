"use client";
import { useEffect } from "react";
import { useMyShifts } from "@/hooks/useMyShifts";

const USER_ID = "59e8182c-6f79-4271-8a96-caa800b00f56";

export default function VolunteerPage() {
  const real = useMyShifts(USER_ID);
  const nullCase = useMyShifts(null);

  useEffect(() => {
    console.log("real:", real);
    console.log(
      "sorted asc:",
      real.data.every(
        (x, i, arr) =>
          i === 0 || arr[i - 1].shift.date.getTime() <= x.shift.date.getTime(),
      ),
    );
  }, [real]);

  useEffect(() => {
    console.log("null:", nullCase);
  }, [nullCase]);

  return <div>Open console + Network tab</div>;
}
