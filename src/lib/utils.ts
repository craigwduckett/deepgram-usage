import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format API path for display, making it more readable
 * Returns an object with a displayPath for UI rendering and tooltip with full path
 */
export function formatApiPath(path: string) {
  // Truncate long paths for display
  const MAX_PATH_LENGTH = 40;
  let displayPath = path;

  if (path.length > MAX_PATH_LENGTH) {
    // Find a good breaking point (after a slash if possible)
    const midPoint = Math.floor(path.length / 2);
    const slashPosition = path.indexOf('/', midPoint);

    if (slashPosition !== -1 && slashPosition < midPoint + 10) {
      // Break after a slash if it's close to the middle
      displayPath = `${path.substring(0, slashPosition + 1)}...${path.substring(path.length - MAX_PATH_LENGTH / 2)}`;
    } else {
      // Otherwise just truncate the middle
      displayPath = `${path.substring(0, MAX_PATH_LENGTH / 2)}...${path.substring(path.length - MAX_PATH_LENGTH / 2)}`;
    }
  }

  return {
    displayPath,
    tooltip: path, // Return the full path as the tooltip
  };
}
