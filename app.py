import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import text

from flask import (
    Flask,
    render_template,
    jsonify)

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///indicators_project.sqlite"
engine = create_engine("sqlite:///indicators_project.sqlite")
session = Session(engine)

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)
# Save references to each table
gdpind = Base.classes.GDPGrowth
techind = Base.classes.TechExports
lifeind = Base.classes.LifeExpectancy


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/countries")
def countries():
    """Return a list of country names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(gdpind).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    # Return a list of unique country names in the first column
    return jsonify(list(df['country'].unique()))


@app.route("/GDPGrowth/<country>")
def GDPGrowth(country):
    """Return `percent`, `year`,and `countries`."""
    stmt = db.session.query(gdpind).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the country 
    gdp_data = df.loc[df['country']==country, ["percent", "year"]]
    # Format the data to send as json
    data = {
        "percent": gdp_data.percent.values.tolist(),
        #"gdp": gdp_data[country].tolist(),
        "year": gdp_data.year.values.tolist(),
    }
    return jsonify(data)


@app.route("/TechExports/<country>")
def TechExports(country):
    """Return `percent`, `year`,and `countries`."""
    stmt = db.session.query(techind).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the country 
    tech_data = df.loc[df['country']==country, ["percent", "year"]]
    # Format the data to send as json
    data = {
        "percent": tech_data.percent.values.tolist(),
        #"tech": tech_data[country].tolist(),
        "year": tech_data.year.values.tolist(),
    }
    return jsonify(data)


@app.route("/LifeExpectancy/<country>")
def LifeExpectancy(country):
    """Return `age`, `year`,and `countries`."""
    stmt = db.session.query(lifeind).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the country
    life_data = df.loc[df['country']==country, ["age", "year"]]
    # Format the data to send as json
    data = {
        "age": life_data.age.values.tolist(),
        #"life": life_data[country].tolist(),
        "year": life_data.year.values.tolist(),
    }
    return jsonify(data)    


if __name__ == '__main__':
    app.run(debug=True)
