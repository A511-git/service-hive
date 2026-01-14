import { useMemo, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { handleApiError } from "../utils/handleApiError";
import { authService } from "../services/auth.service";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isDisabled = useMemo(() => {
        return loading || !email.trim() || !password.trim();
    }, [loading, email, password]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await authService.login({
                email: email.trim(),
                password: password.trim(),
            });
            window.location.href = "/";
        } catch (err) {
            setError(handleApiError(err, "Login failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex align-items-center justify-content-center p-3">
            <div className="w-full" style={{ maxWidth: 460 }}>
                <Card className="surface-card shadow-2 border-round-xl">
                    <div className="flex flex-column gap-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold">Login</div>
                        </div>

                        <Divider className="my-2" />

                        {error ? <Message severity="error" text={error} /> : null}

                        <form onSubmit={onSubmit} className="flex flex-column gap-3">
                            <div className="flex flex-column gap-2">
                                <label className="font-medium">Email</label>
                                <span className="p-input-icon-left">
                                    <InputText
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full"
                                        autoComplete="email"
                                    />
                                </span>
                            </div>

                            <div className="flex flex-column gap-2 p-fluid">
                                <label className="font-medium">Password</label>
                                <Password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    toggleMask
                                    feedback={false}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>


                            <Button
                                type="submit"
                                label={loading ? "Logging in..." : "Login"}
                                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                                disabled={isDisabled}
                                className="w-full"
                            />
                        </form>

                        <div className="text-center text-sm text-color-secondary">
                            Don&apos;t have an account?{" "}
                            <a href="/register" className="font-semibold text-primary">
                                Register
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
