import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../state/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@demo.com", password: "Admin123!" },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.25),_transparent_25%),linear-gradient(160deg,#02111b_0%,#103b39_100%)] px-3 py-6 sm:px-4">
      <div className="grid w-full max-w-5xl gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-6 text-white backdrop-blur sm:p-8 lg:rounded-[2rem] lg:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-teal-200 sm:text-sm sm:tracking-[0.45em]">MVP listo para validar</p>
          <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight sm:mt-6 sm:text-4xl lg:text-5xl">
            Gestion odontologica multi-tenant con foco comercial real.
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-200 sm:mt-6 sm:text-lg">
            Turnos, pacientes, atenciones, tratamientos y pagos con una experiencia limpia para clinicas en crecimiento.
          </p>
        </div>

        <Card className="p-5 sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">Ingresar</h2>
          <p className="mt-2 text-sm text-slate-500">Usuario demo cargado automaticamente para acelerar validacion.</p>
          <form
            className="mt-8 space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              try {
                await login(values.email, values.password);
                toast.success("Sesion iniciada");
                navigate("/dashboard");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "No se pudo iniciar sesion");
              }
            })}
          >
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <Input {...form.register("email")} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <Input type="password" {...form.register("password")} />
            </div>
            <Button type="submit" className="w-full">Entrar al sistema</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
