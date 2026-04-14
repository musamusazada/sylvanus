export function waitFor(seconds: number): Promise<void> {
    return new Promise((resolve) => {
      gsap.delayedCall(seconds, resolve);
    });
}