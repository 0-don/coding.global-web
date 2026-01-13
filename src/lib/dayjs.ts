import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Import locales
import "dayjs/locale/de";
import "dayjs/locale/en";

// Extend dayjs with plugins
dayjs.extend(relativeTime);

export { dayjs };
