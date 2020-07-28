const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request-promise-native');
const matchAll = require("match-all");
const unique = require('array-unique');

try {
    const apiKey = process.env['TRELLO_API_KEY'];
    const apiToken = process.env['TRELLO_API_TOKEN'];
    const action = core.getInput('trello-action');
    switch (action) {
        case 'move_card_when_pull_request_closed':
            moveCardWhenPullRequestClose(apiKey, apiToken);
            break;
    }
} catch (error) {
    core.setFailed(error.message);
}

function moveCardWhenPullRequestClose(apiKey, apiToken) {
    const exitLists = process.env['TRELLO_DEPARTURE_LISTS_ID'];
    const destinationListId = process.env['TRELLO_DESTINATION_LIST_ID'];
    const buildNumber = process.env['GITHUB_RUN_NUMBER'];
    const body = github.context.payload.pull_request.body
    const title = github.context.payload.pull_request.title
    const littlestring = ' ';
    const bigstring = title + littlestring + body;
    const start = async () => {
        const listOfIds = unique(Array.from(matchAll(bigstring, /#(\d+)/g).toArray(), m => +m));
      
        if (listOfIds.length == 0) return;
    
        let cards = [];
    
        for (item of exitLists) {
            const newCards = await getCardsOfList(apiKey, apiToken, item);
            cards = [...cards, ...newCards];
        }
        
        cards
            .filter(card => listOfIds.includes(card.idShort))
            .forEach(card => {
                putCard(apiKey, apiToken, card.id, destinationListId);
                addBuildComment(apiKey, apiToken, card.id, buildNumber); 
            });
      }
      start();  
}

function getCardsOfList(apiKey, apiToken, listId) {
    return new Promise(function (resolve, reject) {
        request(`https://api.trello.com/1/lists/${listId}/cards?key=${apiKey}&token=${apiToken}`)
            .then(function (body) {
                resolve(JSON.parse(body));
            })
            .catch(function (error) {
                reject(error);
            })
    });
}
function putCard(apiKey, apiToken, cardId, destinationListId) {
    const options = {
        method: 'PUT',
        url: `https://api.trello.com/1/cards/${cardId}?key=${apiKey}&token=${apiToken}`,
        form: {
            'idList': destinationListId,
        }
    }
    return new Promise(function (resolve, reject) {
        request(options)
            .then(function (body) {
                resolve(JSON.parse(body));
            })
            .catch(function (error) {
                reject(error);
            })
    });
}

function addBuildComment(apiKey, apiToken, cardId, buildNumber) {
  const options = {
    method: 'POST',
    url: `https://api.trello.com/1/cards/${cardId}/actions/comments?key=${apiKey}&token=${apiToken}&text=Build number: ${buildNumber}`,
  }
  return new Promise(function(resolve, reject) {
    request(options)
      .then(function(body) {
        resolve(JSON.parse(body));
      })
      .catch(function(error) {
        reject(error);
      })
  });
}