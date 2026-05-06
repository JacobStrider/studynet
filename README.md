# studynet

MVP Demo Video:
https://uncg-my.sharepoint.com/:v:/g/personal/jastride_uncg_edu/IQBj-hehnvKxRJJ-PDmxRF2CATJaK988n9y9mza9DoHOvIw?e=PQsMaP

Set up Instructions:
1. Clone repository: git clone https://github.com/JacobStrider/studynet.git
cd studynet

2. Install frontend: cd client --> npm install
3. Install backend: cd server --> npm install

4. configure ENV: DATABASE_URL='postgresql://neondb_owner:npg_ojaSOyBxz3U7@ep-raspy-smoke-amql9s6k-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

(You should never post the env but I wasnt sure if you wanted the direct env I used or just a generic placeholder)

5. Run application:
    Backend: cd server --> node index.js
    Frontend: cd client --> npm start 

Deployed app URL: 
    Frontend: https://studynet-brown.vercel.app/
    Backend: https://studynet-q8mu.onrender.com/

Reflection:

    Design choices:
        -I chose React for my frontend because of how easy it can be to manage the application state. React also provides a great, responsive user experience that seperates frontend logic into clean components for organization.
       - I used Node.js (Express) because express makes it very easy to build REST API`s quickly and efficiently. The backend structure seperatees authentications, the note management, and database interactions clearly and cleanly.
        - I used PostgreSQL for my database because it is reliable, scalable, and one of the most commonly used environments for databases. 
    
    Challenges:     
        A major challenge I faced during this project was configuring user athentication with logging in and out of the website. Once I was able to configure this properly, my actual notes sections was interfered with. Another massive challenged I had outside of organization was deployment troubleshooting my project to github structure issues as my project often times had unnecessary node_module fules that I struggled completely removing. I eventually solved the node_module issue by properly using commands, using .gitignore, and pushing the right documents to github.

        Learning Outcomes:
            After the completion of this project, I have learned how to deploy full-stack applications, how to debug deployment issues through trial and error with terminal commands, thinking through and debugging structure issues across server / client applications. I also learned how frustrating deployment can be as there are many moving parts that need to be properly placed together to work efficiently. 

        Future Work: 
            If I had more time to work on this project, I would love to properly debug, push, and understand the issues I was facing with the note functionality portion after implementing user authentication. I would definitely like to add more security measures to the website as I am very interested in cybersecurity. I would lastly enjoy creating a more visually appealing dashboard for users and adding neat features to the actual orginization of the notes. There is so much creative options with web design that makes exploring websites much more enjoyable after this course. 
