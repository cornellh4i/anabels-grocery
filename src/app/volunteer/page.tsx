"use client";
import { useEffect } from "react";
import { useMyShifts } from "@/hooks/useMyShifts";

const USER_ID = "e1c4ef1a-f802-4b67-b522-9a59f9a4ac46";

export default function VolunteerPage() {
  const real = useMyShifts(USER_ID);
  const nullCase = useMyShifts(null);

  useEffect(() => {
    console.log("real:", real);
    console.log(
      "sorted asc:",
      real.data.every((x, i, arr) =>
        i === 0 || arr[i - 1].shift.date.getTime() <= x.shift.date.getTime()
      )
    );
  }, [real]);

  useEffect(() => {
    console.log("null:", nullCase);
  }, [nullCase]);

  return <div>Open console + Network tab</div>;
}