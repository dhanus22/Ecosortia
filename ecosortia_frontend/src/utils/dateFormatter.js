import { format } from "date-fns";

export function formatDate(date) {
    return format(new Date(date), "dd MMM yyyy, hh:mm a");
}