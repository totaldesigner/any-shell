import configparser

parser = None
config = configparser.ConfigParser()


def init():
    global parser
    if parser is None:
        config.read_file(open('config.ini'))


class ConfigurationError(Exception):
    pass


def get(section, key, default=None, type_=str):
    init()
    global parser
    try:
        return type_(parser.get(section, key))
    except configparser.Error as e:
        if default is None:
            raise ConfigurationError(e.message)
        else:
            return default
    except ValueError:
        raise ConfigurationError("'%s.%s' invalid type (must be %s)" % (
            section, key, type_.__name__))
