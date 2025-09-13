const mongoose = require('mongoose');

if(process.argv.length <3){
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2] //Gib den comman zeilen code aus (Eingegebenes password)

const url =  `mongodb+srv://fullstack:${password}@cluster0.lkjgb3l.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);

mongoose.connect(url) //VErbindung zur Dtaenbank aufbauen

const noteSchema = new mongoose.Schema({
    //Erzeuge Schema für phonebook einträge
    name:String,
    number:String
})

const Person = mongoose.model('Person',noteSchema);

if(process.argv.length===5){
    const name = process.argv[3]
    const number = process.argv[4] 

    const person = new Person({
        name:name,
        number:number
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close();
    })

}else if(process.argv.length ===3){
    Person.find({}).then(result => {
        result.forEach(person => console.log(person.name, person.number));
        mongoose.connection.close();
    })
}else{
    mongoose.connection.close();
    console.log("Wrong parameter input given")
}

