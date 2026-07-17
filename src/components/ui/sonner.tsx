import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast rounded-sm border border-navy/10 bg-card text-navy shadow-none px-4 py-3 font-sans",
          title: "text-sm font-medium tracking-tight text-navy",
          description: "text-xs text-navy/60 mt-0.5",
          actionButton:
            "bg-navy text-paper text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-sm hover:bg-academic",
          cancelButton:
            "bg-mist text-navy/70 text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-sm",
          success: "border-l-2 border-l-teal",
          error: "border-l-2 border-l-destructive",
          warning: "border-l-2 border-l-gold",
          info: "border-l-2 border-l-academic",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
