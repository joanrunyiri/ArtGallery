import Sidebar from "./side-bar";
import Topbar from "./top-bar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar />

      <div className="ml-60 min-h-screen">
        <Topbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}