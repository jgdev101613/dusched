import {
  Show,
  SignInButton,
  SignOutButton,
  useAuth,
  UserButton,
} from "@clerk/react";
import {
  LogInIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "lucide-react";

const App = () => {
  return (
    <div>
      <Show when={"signed-in"}>
        <UserButton />
      </Show>

      <Show when="signed-out">
        <SignInButton mode="modal"></SignInButton>
      </Show>
    </div>
  );
};

export default App;
