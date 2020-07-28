# move-trello-card

This action based on jessicazu/trello-github-actions and made for:

* Finding card number(s) in PR body and title
* Moving trello card(s) from one list to another + adding comment to the trello card with build number (from variable GITHUB_RUN_NUMBER).

Env: 

TRELLO_API_KEY: Your Trello API key

TRELLO_API_TOKEN: Your Trello API token

TRELLO_DEPARTURE_LIST_ID: Your Trello list ID to move from 

TRELLO_DESTINATION_LIST_ID: Your Trello list ID to move to

How to use:

      - name: Move trello card 
        uses: the-real-mpgames/move-trello-card@v2
        with:
          trello-action: move_card_when_pull_request_closed
        env:
          TRELLO_API_KEY:  ${{ secrets.TRELLO_API_KEY }}
          TRELLO_API_TOKEN: ${{ secrets.TRELLO_API_TOKEN }}
          TRELLO_DEPARTURE_LIST_ID: ${{ secrets.TRELLO_DEPARTURE_LIST_ID }}
          TRELLO_DESTINATION_LIST_ID: ${{ secrets.TRELLO_DESTINATION_LIST_ID }}