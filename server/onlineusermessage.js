class User {
    constructor(data) {
        this.username = data;
        this.msg = [];
        this.next = null;
    }
}

class User_list {
    constructor() {
        this.head = null;
        this.last = null;
    }

    insert(data) {
        if (this.head === null) {
            this.head = new User(data);
            this.last = this.head;
            return this.last;
        } else {
            this.last.next = new User(data);
            let temp=this.last;
            this.last = this.last.next;
            return temp;
        }
    }

    find(username) {
        let temp = this.head;
        if(this.head == null){
            return null;
        }
        while (temp != null) {
            if (temp.username === username) {
                return temp;
            }
            temp = temp.next;
        }
        return null;
    }
    findAndDelete(username) {
        let temp = this.head;
        let pre = null;
        let deletedNode = null;
        
        while (temp != null) {
            if (temp.username === username) {
                if (pre === null) {
                    // If the node to be deleted is the head node
                    this.head = temp.next;
                    // Update last if head is null (no nodes left)
                    if (this.head === null) {
                        this.last = null;
                    }
                } else {
                    pre.next = temp.next;
                    // If the node to be deleted is the last node
                    if (temp.next === null) {
                        this.last = pre;
                    }
                }
                deletedNode = temp;
                break;
            }
            pre = temp;
            temp = temp.next;
        }
        return deletedNode;
    }
    
    print(){
        let temp=this.head;
        while(temp != null){
            console.log(temp.msg);
            temp=temp.next;
        }
    }
}

module.exports=User_list