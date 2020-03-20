export default class Emitter<T> {
  private consumers = new Map<object, (value: T) => void>();

  subscribe(consumer: (value: T) => void): { unsubscribe: () => void } {
    const consumerKey = Object.create(null);
    this.consumers.set(consumerKey, consumer);

    return {
      unsubscribe: () => {
        if (this.consumers && consumerKey) {
          this.consumers.delete(consumerKey);
        }
      },
    };
  }

  emit(value: T) {
    if (this.consumers.size === 0) {
      return;
    }
    this.consumers.forEach((consumer) => consumer(value));
  }

  clear() {
    this.consumers.clear();
  }
}
