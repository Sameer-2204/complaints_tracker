const express=require('express');

const app=express();

app.use(express.json());
app.use(express.static("public"));

let complaints=[];
let idcounter=1;

app.get("/complaints",(req,res)=>{
    res.json(complaints);
});

app.get("/complaints/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const complaint=complaints.find(c=>c.id==id);

    if(!complaint){
        return res.json("Complaint not found");
    }

    res.json(complaint);
});

app.post("/complaints",(req,res)=>{
    console.log(req.body);
    const { name, email, title, description } = req.body;

    if (!name || !email || !title || !description) {
    return res.json("All fields are required");
    }

    const newcomplaint = {
    id: idcounter++,
    name,
    email,
    title,
    description,
    status: "pending",
    date: new Date().toISOString().split("T")[0]
    };

    complaints.push(newcomplaint);
    res.json(newcomplaint);
});

app.put("/complaints/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const {status}=req.body;
    const complaint=complaints.find(c=>c.id==id);
    if(!complaint){
        return res.json("Complaint not found")
    }
    complaint.status=status;
    res.json(complaint);
});

app.delete("/complaints/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const index=complaints.findIndex(c=>c.id==id);

    if(index==-1){
        return res.json("Complaint not found")
    }

    complaints=complaints.filter(c=>c.id!=id);

    res.json({ message: "Complaint deleted successfully" });

})

app.listen(3000, ()=>{
    console.log(`Server running on http://localhost:3000`)
})