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
        while (temp != null) {
            if (temp.username === username) {
                return temp;
            }
            temp = temp.next;
        }
        return false;
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