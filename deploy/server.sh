#!/bin/bash

heroku login

git subtree push --prefix server heroku master