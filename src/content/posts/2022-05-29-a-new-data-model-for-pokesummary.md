---
title: 'A New Data Model for Pokesummary'
pubDate: 2022-07-01
description: 'This is the first post of my new Astro blog.'
author: 'Astro Learner'
tags: ["astro", "blogging", "learning in public"]
---

This past week, I made significant technical changes to [Pokésummary](https://github.com/seasonedfish/pokesummary),
my command-line Python program.
In this blog post, I'll recount the process of redesigning the data model.

## Some background
Pokésummary version 1 consisted of three modules:
`__main__.py`, which contained the logic for reading Pokémon data into memory and handled the command-line interface;
`displaying.py`, which handled displaying Pokémon summaries;
and `parsing.py`, which contained a utility function for reading `csv` files into dictionaries.
I was unsatisfied with this structure--I didn't like how `__main__.py`
violated the single responsibility principle.

Additionally, with the way I stored Pokémon data into memory,
it was hard to reason about my program.
In `__main__.py`, I had the following code to get the data of every Pokémon:
```python
data_dictionary = parsing.csv_to_nested_dict(
    "pokesummary.data",
    "pokemon_modified.csv",
    "pokemon_name"
)
```
This gave me a 2D dictionary: the outer dictionary mapped Pokémon names to stats,
and the inner dictionaries (the stats) mapped specific attributes (e.g. "attack_stat") to values (e.g. 49).
The problem was that my code didn't explicitly define which attributes the stats should have.
The attributes were given by my *dataset*,
so my code in `displaying.py` had to know the column names of my dataset to access attributes.
For example, here is how I accessed a Pokémon's classification:
```python
pokemon_stats['classification']
```
Since the column name for Pokémon classifications in the dataset is
"classification", I had to use that string as my dictionary key.
Surely there was a better way.

## The model-view-controller design pattern
I remembered someone had once told me about the model-view-controller design pattern.
The idea is to separate your program into three components:
the model manages the program's data,
the view displays the data,
and the controller responds to user input.

It seemed like this could work well for Pokésummary.
I had the view already, `displaying.py`.
I also had the controller, `__main__.py`.
I just needed a model for Pokémon stats.
Creating this model would explicitly define which attributes were available,
and separating out the logic that read data into it from the controller
would satisfy the single responsibility principle.

## Data Classes
Since my Pokémon stats model would store data,
I implemented it using Data Classes.

With normal classes, you need to write an `__init__()` method (the constructor).
Data Classes make things simpler by automatically generating it;
all you need to do is define the class's attributes and their types[^1].

I made a `Pokemon` class, which contains a `PokemonBaseStats`--here is the code:
```python
@dataclass(frozen=True)
class BaseStats:
    hp: int
    attack: int
    defense: int
    special_attack: int
    special_defense: int
    speed: int


@dataclass(frozen=True)
class Pokemon:
    name: str
    classification: str
    height: float
    weight: float

    primary_type: str
    secondary_type: str

    base_stats: BaseStats
```

Now, with Data Classes, the available attributes are explicitly defined.
I can also now use dot notation,
which is much cleaner than using key lookup:
```python
pokemon.classification
```

## Inheriting from UserDict
Next, I needed a way to read my dataset into a collection of `Pokemon` objects.
I thought it'd be nice to create my own class that mapped strings to `Pokemon`;
the class could encapsulate reading from my dataset.
Maybe inherit from `dict`?
But, reading an [article](https://treyhunner.com/2019/04/why-you-shouldnt-inherit-from-list-and-dict-in-python/) on this,
I saw that inheriting from `dict` had some unexpected behavior.
So, I followed the article's advice and inherited from `UserDict` instead.

`UserDict` is a wrapper around a dictionary object,
but it is implemented such that values can be accessed just like a dictionary.

The `UserDict` constructor allowed me to give the internal dictionary some initial data.
So, to implement `PokemonDict`,
I created a static method to read my dataset into a dictionary,
and I passed the output of this method into the constructor.
```python
class PokemonDict(UserDict):
    def __init__(self):
        pokemon_dictionary = self.read_dataset_to_dictionary()
        UserDict.__init__(self, pokemon_dictionary)

    @staticmethod
    def read_dataset_to_dictionary():
        with resources.open_text(data, "pokemon_modified.csv") as f:
            csv_iterator = csv.DictReader(f)

            dataset_dict = {
                csv_row["pokemon_name"]: Pokemon(
                    name=csv_row["pokemon_name"],
                    classification=csv_row["classification"],
                    height=float(csv_row["pokemon_height"]),
                    weight=float(csv_row["pokemon_weight"]),
                    primary_type=csv_row["primary_type"],
                    secondary_type=csv_row["secondary_type"],
                    base_stats=BaseStats(
                        hp=int(csv_row["health_stat"]),
                        attack=int(csv_row["attack_stat"]),
                        defense=int(csv_row["defense_stat"]),
                        special_attack=int(csv_row["special_attack_stat"]),
                        special_defense=int(csv_row["special_defense_stat"]),
                        speed=int(csv_row["speed_stat"]),
                    )
                )
                for csv_row in csv_iterator
            }
        return dataset_dict
```
Although this dictionary comprehension isn't too pretty,
it's much more explicit than before.
Each attribute of the `Pokemon` class is mapped to a value from the current row.

And with this, I was able to replace the complicated `csv_to_nested_dict` call with one line:
```python
pokemon_dict = PokemonDict()
```
The logic of reading Pokémon data is no longer in the controller part of the program,
thus satisfying the single responsibility principle.

With both of my problems solved,
I could finally rest easy--wait no, who am I kidding?
As always, I wanted to do more.

## Enums
There was one thing in particular that was bothering me:
I had stored Pokémon types as strings, but it would be better to represent them using enum members
since there's a small set of Pokémon types.
Enums are great in cases like these because they clearly document the possible values
and prevent errors caused by using invalid ones[^2].

I created an enum, `PokemonType`:
```python
@unique
class PokemonType(Enum):
    NORMAL = "Normal"
    FIRE = "Fire"
    # ... [rest of the types omitted for brevity]
```

Now, in the `Pokemon` class, I could write:
```python
primary_type: PokemonType
```
and in `PokemonDict`:
```python
primary_type=PokemonType(csv_row["primary_type"]),
```

But, what about secondary type?
A Pokémon might not have two types; in that case, `csv_row["secondary_type"]` would be an empty string.
With enums, I initially thought I'd have a `NO_TYPE = ""` member.
However, it didn't make sense for `NO_TYPE` to show up when you iterated through the enum members.

Looking this up, it seemed like the [consensus](https://stackoverflow.com/a/1795662)
was that it's better to use a nullable: a variable set to `None` in the absence of a value.

My initial code for this was probably the worst Python I've ever written.
```python
secondary_type=PokemonType(s) if (s := csv_row["secondary_type"]) else None
```
Since this was in the dictionary comprehension,
I needed to use an assignment expression (`:=`), which isn't supported in Python 3.7.
A clear no-go.

I ended up learning about class methods[^3],
which are commonly used to provide multiple ways to instantiate a class.
I wrote a class method with the same functionality as the above code block:
```python
@classmethod
def optional_pokemon_type(cls, s: str):
    if s == "":
        return None
    return cls(s)
```

With this, I could write:
```python
secondary_type=PokemonType.optional_pokemon_type(csv_row["secondary_type"])
```

Still pretty long, but much easier to understand.

## The grid of type defenses
With `PokemonType` as an enum, I could use its members as the keys of a dictionary.
So, I rewrote the code for the grid of type defenses to use `PokemonType`.

First, I defined `TypeDefenses` as an alias for `Dict[PokemonType, float]`.

Then, I wrote the `TypeDefensesDict` class; although similar to `PokemonDict`, it caused me a fair amount of pain to write.
Here is its `_read_dataset_to_dict()` method:
```python
@staticmethod
def _read_dataset_to_dict() -> Dict[PokemonType, TypeDefenses]:
    with resources.open_text(data, "type_defenses_modified.csv") as f:
        data_iterator = csv.reader(f, quoting=csv.QUOTE_NONNUMERIC)
        # Gets the column names as a list of PokemonType members.
        attacking_types = [
            PokemonType(s)
            for s in data_iterator.__next__()[1:]
        ]

        all_type_defenses = {
            PokemonType(row[0]): dict(
                zip(attacking_types, cast(List[float], row[1:]))
            )
            for row in data_iterator
        }
    return all_type_defenses
```
I found that you could read numbers directly as floats using `quoting=csv.QUOTE_NONNUMERIC`,
but the problem was, Python couldn't know that each `row` contained all floats besides the first element.
Mypy kept giving me errors, thinking that the elements of each `row` were all supposed to be strings.
I came up with some ideas to resolve this,
but they didn't work,
so I ended up using the `cast` function from `typing` to make mypy happy.

## Addendum: Why not use namedtuples?
I experimented with using namedtuples to store Pokémon data instead of Data Classes.
From a purely practical standpoint, namedtuples are better--they are slightly faster,
reducing the time to print two summaries by around 10ms.
They also use less memory; when I left `pokesummary -i` open,
the version with Data Classes used 11MB of memory,
while the version with namedtuples used 10MB of memory.

However, using namedtuples makes less sense than using Data Classes from a design standpoint.
From my understanding, namedtuples should only be used as a replacement for tuples[^4];
they keep all the functionality of tuples.
So, namedtuples are iterable, and they can be unpacked.
This kind of functionality doesn't make sense for Pokémon objects.

[^1]: Data Classes also generate `__repr__()`, `__eq__()`, and `__hash__()`, but these aren't relevant in Pokésummary.
[^2]: See [here](https://stackoverflow.com/a/4709224) for a general explanation of enums, and [here](https://stackoverflow.com/a/37601645) for a Python-specific one.
[^3]: See [this article](https://realpython.com/python-multiple-constructors/#providing-multiple-constructors-with-classmethod-in-python) for a more thorough explanation of class methods.
[^4]: I gathered this from reading this [thread](https://news.ycombinator.com/item?id=15132670) on Hacker News.