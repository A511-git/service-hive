import { useMemo, useRef } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";

export default function AppNavbar() {
    const navigate = useNavigate();
    const toastRef = useRef(null);

    const { isLoggedIn, user } = useAuth();

    const items = useMemo(() => {
        const base = [
            {
                label: "Gigs",
                icon: "pi pi-briefcase",
                command: () => navigate("/gigs"),
            },
        ];

        if (isLoggedIn) {
            base.push({
                label: "Bids",
                icon: "pi pi-inbox",
                command: () => navigate("/bids"),
            });
        }

        return base;
    }, [navigate, isLoggedIn]);


    const start = (
        <div
            className="flex align-items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
            role="button"
            tabIndex={0}
        >
            <i className="pi pi-bolt text-primary text-xl" />
            <span className="font-bold text-lg">ServiceHive</span>
        </div>
    );

    const end = (
        <div className="flex align-items-center gap-2">
            {isLoggedIn ? (
                <>
                    <span className="hidden md:inline text-sm text-color-secondary">
                        {user?.name ? `Hi, ${user.name}` : "Logged in"}
                    </span>

                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        className="p-button-outlined"
                        onClick={() => {
                            authService.logout();
                            toastRef.current?.show({
                                severity: "success",
                                summary: "Logged out",
                                detail: "You have been logged out.",
                                life: 1500,
                            });
                            navigate("/login");
                        }}
                    />
                </>
            ) : (
                <>
                    <Button
                        label="Login"
                        icon="pi pi-sign-in"
                        className="p-button-text"
                        onClick={() => navigate("/login")}
                    />
                    <Button
                        label="Register"
                        icon="pi pi-user-plus"
                        onClick={() => navigate("/register")}
                    />
                </>
            )}
        </div>
    );

    return (
        <>
            <Toast ref={toastRef} />
            <Menubar model={items} start={start} end={end} className="border-noround" />
        </>
    );
}
