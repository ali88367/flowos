export const MOTIVATIONAL_QUOTES: string[] = [
  "Small steps every day add up to big change.",
  "Done is better than perfect.",
  "Discipline is choosing between what you want now and what you want most.",
  "You don't have to see the whole staircase, just take the first step.",
  "Progress, not perfection.",
  "The best time to start was yesterday. The next best time is now.",
  "Focus on being productive instead of busy.",
  "A little progress each day adds up to big results.",
  "What you do today can improve all your tomorrows.",
  "Motivation gets you started. Habit keeps you going.",
  "Start where you are. Use what you have. Do what you can.",
  "Success is the sum of small efforts repeated daily.",
  "Don't watch the clock; do what it does — keep going.",
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Your future is created by what you do today, not tomorrow.",
  "Every accomplishment starts with the decision to try.",
  "Consistency is what transforms average into excellence.",
];

export function randomQuote(): string {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}
