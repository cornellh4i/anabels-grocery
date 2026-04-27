"use client";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useMyShifts } from "@/hooks/useMyShifts";

const USER_ID = "92995522-c2ff-46f4-b332-fac74dae718c";

// TODO: move sign out to a proper nav component once UI is designed
async function handleSignOut() {
  await signOut(auth);
  document.cookie = "session=; path=/; max-age=0";
  // TODO: redirect to /login after sign out
}

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

  return (
    <div>
      <div>Open console + Network tab</div>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
