const id = 'CLIENT_ID'
const sec = 'SECRET_ID'
const git_api = 'https://api.github.com'
const params = `?client_id=${id}&client_secret=${sec}`

function getErrorMsg(message, username) {
    if(message === 'Not Found') {
        return `${username} doesn't exist`
    }

    return message
}

function getProfile(username) {
    return fetch(`${git_api}/users/${username}`)
        .then((res) => res.json())
        .then((profile) => {
            if(profile.message) {
                throw new Error(getErrorMsg(profile.message, username))
            }

            return profile
        })
}

function getRepos(username) {
    return fetch(`${git_api}/users/${username}/repos?per_page=100`)
        .then((res) => res.json())
        .then((repos) => {
            if (repos.message) {
                throw new Error(getErrorMsg(repos.message, username))
            }

            return repos
        })
}

function getStarCount(repos) {
    // Reduce to one, count being prev amt initial is set to 0, and then deconstructing
    return repos.reduce((count, {stargazers_count}) => count + stargazers_count, 0)
}

function calculateScore (followers, repos) {
    return (followers * 3) + getStarCount(repos)
}

function getUserData(player) {
    return Promise.all([
        getProfile(player),
        getRepos(player)
    ]).then(([profile, repos]) => ({
        profile,
        score: calculateScore(profile.followers, repos)
    }))
}

function sortPlayers(players) {
    return players.sort((a,b) => b.score - a.score)
}

export function battle(players) {
    return Promise.all([
        getUserData(players[0]),
        getUserData(players[1])
    ]).then((results) => sortPlayers(results))
}

export function fetchPopularRepos(language) {
    // Used ` to embed JavaScript ${}
    const endpoint = window.encodeURI(`${git_api}/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)

    return fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
            // items is a part of the API's return
            if(!data.items) {
                throw new Error(data.message)
            }

            return data.items
        })
}