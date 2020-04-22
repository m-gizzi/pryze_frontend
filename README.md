# README

Quick links:
Backend repo: https://github.com/m-gizzi/pryze_backend

Demo: https://www.youtube.com/watch?v=GvI3tYqPXQQ

Live Site: https://pryze-83358.herokuapp.com/

__________________________________________

Pryze is an app designed to simplify and gamify the process of donating to fundraisers, dreamed up during the coronavirus pandemic during spring 2020.  There are thousands of possible fundraisers active to donate to, and assuming all are deserving, this app seeks to increase fairness and equitability in donations by randomizing the recipients.  Users can avoid the moral fatigue that comes with an overwhelming number of cries for help, and fundraisers don't have to worry about things like marketing which can create a certain amount of bias in the process of seeking funds.

### Prerequisites

While this app can mostly be cloned as is (don't forget the frontend repo, linked above), it does assume you have an active Square developer's account.  You can get that started here: https://developer.squareup.com/us/en

Once you have an account you can create your app.  There are three tokens Square will give you:

* Application ID

* Location ID

* Access Token

The first two will need to be added to Square's Payment Form as props in the frontend (see PaymentPage.js in the other repo).  The second will need to be added to your backend (see the Users controller and Game model).

A number of fundraisers are currently included in the seeds file.  Add more by modifying that file.

### Built With
* React
* Ruby
* Rails API utilizing Active Model Serializers
* PostgreSQL Database using ActiveRecord
* React Map GL
* Square Payment Form

### Server-Side Install Instructions
1. Run ```bundle install```
2. Run ```rake db:create```
3. Run ```rake db:migrate```
4. Run ```rake db:seed```
5. Run ```rails s -p 3001```
### Client-Side Install Instructions
1. Run ```npm install```
2. Run ```npm start```

### The App

The app itself is designed to be relatively simple.  Simply enter an amount to donate, and then pay either by using the credit card form or a saved payment method from the dropdown.  The app will then generate subdonations randomly based off of your donation, which you can interact with and see on the map.

There are three methods of randomization going on here, each of which happens sequentially.

1. A random number of subdonation are created.  This uses the standard Ruby rand() method.

2. A fundraiser is assigned to each subdonation.  To avoid assigning the same one more than once in the same game, this one uses this randomization:

```
recipient_fundraisers = (1..total_fundraisers).to_a.shuffle.take(number_of_donations)
```

Think of this as generating a deck of cards with every possible outcome, then shuffling and taking the top x many.

3. An amount is assigned to each subdonation.  This one is a tad complicated, but here's the responsible code:

```
amount_array = (2..(self.amount * 100 + number_of_donations - 1)).to_a.shuffle.take(number_of_donations - 1)
    amount_array.sort!

    donations_array.each_with_index do |donation_hash, index|

      if number_of_donations == 1
        amount = self.amount
      elsif index == 0
        amount = (amount_array[index] - 1).to_f / 100
      elsif index == donations_array.length - 1
        amount = (self.amount * 100 + number_of_donations - 1 - amount_array[index - 1]).to_f / 100
      else
        amount = (amount_array[index] - amount_array[index - 1] - 1).to_f / 100
      end

      donation_hash[:amount] = amount

    end
```

I am generating an array of numbers from 2 to the total donation (plus some modification to make the probability work out).  I can then use the difference between these numbers to create the amounts, such that they add up to the total donation.  The if statement is handling cases where there is only one subdonation, the first subdonation is being created, the last one is being created, and all others in between.

### Author

Matthew Gizzi
