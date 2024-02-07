class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkList {
    constructor() {
        this.head = null;
        this.last = null;
    }

    insert(data) {
        if (this.head === null) {
            this.head = new Node(data);
            this.last = this.head;
        } else {
            this.last.next = new Node(data);
            this.last = this.last.next;
        }
    }

    print() {
        let temp = this.head;
        while (temp !== null) {
            console.log(temp.data);
            temp = temp.next;
        }
    }
    find(data){
        let temp=this.head;
        while(temp != null){
            if(temp.data == data){
                return true;
            }
            temp=temp.next;
        }
        return false;
    }
    findAndDelete(data) {
        if (this.head.data === data) {
            this.head = this.head.next;
            return true;
        }
    
        let temp = this.head;
        let pre = null;
        while (temp !== null) {
            if (temp.data === data) {
                pre.next = temp.next;
                return true;
            }
            pre = temp;
            temp = temp.next;
        }
        return false;
    }
    
}

module.exports=LinkList;