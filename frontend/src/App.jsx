import { Show, SignInButton, useAuth, UserButton } from "@clerk/react";
import {
  LogInIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "lucide-react";

const App = () => {
  return (
    <Show when={"signed-out"}>
      <SignInButton mode="modal">
        <button
          type="button"
          className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-primary px-3 py-2 flex font-semibold text-primary-content shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/20"
        >
          <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-120%] transition-transform duration-700 group-hover:translate-x-[120%]" />

          <span className="relative flex items-center gap-2 text-sm">
            <LogInIcon className="size-4" />
            Sign In
          </span>
        </button>
      </SignInButton>
    </Show>
  );

  {
    /* User */
  }
  <Show when={"signed-in"}>
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-base-200/40 px-2 py-1.5">
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-10 w-10 ring-2 ring-primary/20 shadow-lg",
          },
        }}
      />

      {(role === "admin" || role === "support") && (
        <div className="hidden md:flex">
          <span className="text-sm font-semibold capitalize text-primary">
            {role}
          </span>
        </div>
      )}
    </div>
  </Show>;
};

export default App;
