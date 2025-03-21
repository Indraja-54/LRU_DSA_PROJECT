class CDLLNode {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.next = null;
        this.prev = null;
    }
}

class CDLL {
    constructor() {
        this.head = null;
    }
    addAtFirst(key, val) {
        let nn = new CDLLNode(key, val);
        nn.next = nn;
        nn.prev = nn;
        if (this.head == null) {
            this.head = nn;
            return this.head;
        }
        nn.next = this.head;
        nn.prev = this.head.prev;
        this.head.prev.next = nn;
        this.head.prev = nn;
        this.head = nn;
        return this.head;
    }
    moveAtFront(x) {
        if (x == this.head) return this.head;
        x.prev.next = x.next;
        x.next.prev = x.prev;
        x.next = this.head;
        x.prev = this.head.prev;
        this.head.prev.next = x;
        this.head.prev = x;
        this.head = x;
        return this.head;
    }
    deleteAtEnd() {
        if (this.head == null) return null;
        let last = this.head.prev;
        if (last == this.head) {
            this.head = null;
            return last;
        }
        let slast = last.prev;
        slast.next = this.head;
        this.head.prev = slast;
        return last;
    }
}

class LRU {
    constructor(capacity) {
        this.capacity = capacity;
        this.size = 0;
        this.map = new Map();
        this.cd = new CDLL();
    }
    put(key, val) {
        if (this.map.has(key)) {
            this.map.get(key).val = val;
            this.cd.moveAtFront(this.map.get(key));
        } else if (this.size < this.capacity) {
            let x = this.cd.addAtFirst(key, val);
            this.size++;
            this.map.set(key, x);
        } else {
            let x = this.cd.deleteAtEnd();
            this.map.delete(x.key);
            let y = this.cd.addAtFirst(key, val);
            this.map.set(key, y);
        }
    }
    get(key) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            this.cd.moveAtFront(node);
            return node.val;
        }
        return null;
    }
    getEntries() {
        let arr = [];
        let ptr = this.cd.head;
        if (ptr != null) {
            arr.push([ptr.key, ptr.val]);
            ptr = ptr.next;
            while (ptr != this.cd.head) {
                arr.push([ptr.key, ptr.val]);
                ptr = ptr.next;
            }
        }
        return arr;
    }
}

module.exports = LRU;
