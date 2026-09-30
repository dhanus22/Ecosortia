import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import useAuth from "../../hooks/useAuth";
import {
    getMunicipalityUsers,
    createMunicipalityUser,
    updateMunicipalityUserRole,
} from "../../services/adminService";

function MunicipalityUsers() {
    const { user } = useAuth();
    const currentUser = user?.user ?? user;

    const isMainAdmin =
        currentUser?.is_superuser === true ||
        currentUser?.role === "Main Admin";

    const isMunicipalityAdmin =
        !isMainAdmin &&
        (currentUser?.role === "Municipality Admin" ||
            currentUser?.groups?.includes?.("Municipality Admin"));

    const canCreateUser = isMainAdmin || isMunicipalityAdmin;
    const canUpdateRole = isMainAdmin;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        password: "",
        role: "Municipality Staff",
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getMunicipalityUsers();
            setUsers(data.results ?? data);
        } catch (error) {
            toast.error("Unable to load municipality users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setForm((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const resetForm = () => {
        setForm({
            username: "",
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            address: "",
            password: "",
            role: "Municipality Staff",
        });
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            await createMunicipalityUser(form);

            toast.success("Municipality user created successfully.");

            resetForm();
            setShowForm(false);
            await fetchUsers();
        } catch (error) {
            const response = error.response?.data;
            const errors = response?.errors || response;

            if (errors && typeof errors === "object") {
                Object.values(errors).forEach((messages) => {
                    toast.error(
                        Array.isArray(messages) ? messages[0] : messages
                    );
                });
            } else {
                toast.error("Unable to create municipality user.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await updateMunicipalityUserRole(id, role);

            setUsers((current) =>
                current.map((municipalityUser) =>
                    municipalityUser.id === id
                        ? { ...municipalityUser, role }
                        : municipalityUser
                )
            );

            toast.success("User role updated.");
        } catch (error) {
            toast.error("Unable to update user role.");
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Municipality Users
                    </h1>

                    <p className="text-slate-500 mt-2">
                        {isMainAdmin
                            ? "Create and manage municipality accounts."
                            : isMunicipalityAdmin
                            ? "Create municipality accounts and view existing users."
                            : "View municipality accounts."}
                    </p>
                </div>

                {canCreateUser && (
                    <button
                        type="button"
                        onClick={() => setShowForm((current) => !current)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        <UserPlus size={18} />
                        Create User
                    </button>
                )}
            </div>

            {canCreateUser && showForm && (
                <Card>
                    <h2 className="text-lg font-semibold mb-5">
                        Create Municipality User
                    </h2>

                    <form onSubmit={handleCreate} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <Input
                                label="Username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="First Name"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                            />

                            <Input
                                label="Last Name"
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                            />

                            <Input
                                label="Phone Number"
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Input
                            label="Address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                        />

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Role
                            </label>

                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            >
                                <option value="Municipality Staff">
                                    Municipality Staff
                                </option>

                                <option value="Municipality Admin">
                                    Municipality Admin
                                </option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Creating..." : "Create User"}
                            </Button>

                            <button
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    setShowForm(false);
                                }}
                                className="px-5 py-3 border rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-slate-50">
                            <tr>
                                <th className="text-left p-4">Username</th>
                                <th className="text-left p-4">Name</th>
                                <th className="text-left p-4">Email</th>
                                <th className="text-left p-4">Role</th>
                                <th className="text-left p-4">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {users.map((municipalityUser) => (
                                <tr key={municipalityUser.id}>
                                    <td className="p-4 font-medium">
                                        {municipalityUser.username}
                                    </td>

                                    <td className="p-4">
                                        {municipalityUser.first_name}{" "}
                                        {municipalityUser.last_name}
                                    </td>

                                    <td className="p-4">
                                        {municipalityUser.email}
                                    </td>

                                    <td className="p-4">
                                        {canUpdateRole ? (
                                            <select
                                                value={municipalityUser.role || ""}
                                                onChange={(e) =>
                                                    handleRoleChange(
                                                        municipalityUser.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded-lg px-3 py-2"
                                            >
                                                <option value="Municipality Staff">
                                                    Municipality Staff
                                                </option>

                                                <option value="Municipality Admin">
                                                    Municipality Admin
                                                </option>
                                            </select>
                                        ) : (
                                            <span className="text-slate-600">
                                                {municipalityUser.role || "-"}
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={
                                                municipalityUser.is_active
                                                    ? "text-emerald-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {municipalityUser.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default MunicipalityUsers;