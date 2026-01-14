import { useMemo, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { handleApiError } from "../utils/handleApiError";
import { authService } from "../services/auth.service";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isDisabled = useMemo(() => {
        return loading || !name.trim() || !email.trim() || !password.trim();
    }, [loading, name, email, password]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await authService.register({
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
            });

            setSuccess("Registered successfully. Please login.");
            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                window.location.href = "/login";
            }, 700);
        } catch (err) {
            setError(handleApiError(err, "Register failed"));
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
                            <div className="text-2xl font-bold">Register</div>
                        </div>

                        <Divider className="my-2" />

                        {error ? <Message severity="error" text={error} /> : null}
                        {success ? <Message severity="success" text={success} /> : null}

                        <form onSubmit={onSubmit} className="flex flex-column gap-3">
                            <div className="flex flex-column gap-2">
                                <label className="font-medium">Name</label>
                                <span className="p-input-icon-left">
                                    <InputText
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full"
                                        autoComplete="name"
                                    />
                                </span>
                            </div>

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
                                    feedback={true}
                                    placeholder="Min 6 characters"
                                    autoComplete="new-password"
                                />
                            </div>

                            <Button
                                type="submit"
                                label={loading ? "Creating..." : "Create Account"}
                                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-user-plus"}
                                disabled={isDisabled}
                                className="w-full"
                            />
                        </form>

                        <div className="text-center text-sm text-color-secondary">
                            Already have an account?{" "}
                            <a href="/login" className="font-semibold text-primary">
                                Login
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
