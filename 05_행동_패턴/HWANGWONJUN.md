```js
class Complaint {
  constructor() {
    this.ComplainingParty = ''
    this.ComplaintAbout = ''
    this.Complaint = ''
  }
}

class ClerkOfTheCourt {
 isAbleToResolveComplaint(complaint) {
   // 서기가 해결할수 있는가 ?
   return true
 }
  
 listenToComplaint(complaint) {
   return true
 }
}

class King {
 isAbleToResolveComplaint(complaint) {
   // 왕이 해결할수 있는가?
   return true
 }
  
 listenToComplaint(complaint) {
   return true
 }
}



class ComplaintResolver {
  constructor() {
    this.complaintListeners = []
    this.complaintListeners.push (new ClerkOfTheCourt())
    this.complaintListeners.push (new King())
  }
  
  resolveComplaint(complaint) {
    for (var i = 0; i < this.complaintListeners.length; i++) {
      if (this.complaintListeners[i].isAbleToResolveComplaint(complaint))
        this.complaintListeners[i].listenToComplaint(complaint)
    }
  }
}


```
