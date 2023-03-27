# Multi-armed bandit visualization for personal sociale media recommendation

## Tech
- Frontend: **ReactJs**
- Backend: **python**
    - serve the frontend static page in `build` by **Flask**
- Container: **Docker** & **docker-compose**
- Visualization: **d3.js**
- Frontend Framework: [React Bootstrap](https://react-bootstrap.github.io/)



## Structure
```bash
_
|__ api         # python server with flask
|__ deployment  # docker compose
|__ public      # static file
|__ src         # react app

```

## Code Smell
- all the pages (web) should be in `view` folder
- all the components in different pages should places under  `component` > `view_name`
- install only needed dependencies without making the whole bundle size too large


## Init
### Python Server
```bash
cd api
python3 -m venv venv
source venv/bin/activate
```

(vevnv)
```bash
 pip install flask python-dotenv
```


### React Frontend
using yarn for package manage
```bash
# chechk your node version, using 16 is better
nvm use 16

# install yarn gloabally
npm i -g yarn
```

Install all Dependencies
```bash
yarn 
```

Run React (port 3000)
```bash
yarn start
# "start": "react-scripts start"
```

Run Python Server
```bash
yarn start-api
# "start-api": "cd api && venv/bin/flask run --no-debugger"
```


Build Static website in `Public`
```bash
yarn build
# "build": "react-scripts build"
```



---




This structure of the repos created on top of this [tutorial](https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project)


