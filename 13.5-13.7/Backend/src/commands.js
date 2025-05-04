require('dotenv').config()
const { spawn, exec } = require('child_process')
const string = `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOSTNAME}.oregon-postgres.render.com/${process.env.DATABASE_NAME}`
const command = process.argv[2]

if (command === 'connect') {
    const child = spawn('psql', [string], {
        stdio: 'inherit'
    })
    
    child.on('exit', code => {
        console.log(code)
    })
}

if (command === 'tables') {
    exec(`psql "${string}" -c "\\dt"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Virhe: ${error.message}`)
          return
        }
        if (stderr) {
          console.error(`Virhe: ${stderr}`)
          return
        }
        console.log(stdout)
      })
}