import os
import sys
import json
from datetime import datetime, timezone

if len(sys.argv) != 2:
  name = sys.argv[0]
  print(f"Usage: python3 {name} <base-dir>")
  sys.exit(1)

base_dir = sys.argv[1]

notebooks = [
  {
    "name": "Inbox",
    "uuid": "Inbox",
  },
]


def convert_to_iso8601(ts):
  return datetime.fromtimestamp(ts, timezone.utc).isoformat()


def read_and_parse_json(filename):
  with open(os.path.join(base_dir, filename), "r", encoding="utf-8") as file:
    return json.load(file)


def get_note(notebook_name, notebook_uuid, note_dir_name):
  path = f"{notebook_uuid}.qvnotebook/{note_dir_name}"

  meta = read_and_parse_json(f"{path}/meta.json")
  content = read_and_parse_json(f"{path}/content.json")

  return {
    "uuid": meta["uuid"],
    "title": meta["title"],
    "contents": "\\n\\n".join(cell["data"] for cell in content["cells"]),
    "notebook": notebook_name,
    "created_at": convert_to_iso8601(meta["created_at"]),
    "updated_at": convert_to_iso8601(meta["updated_at"]),
  }


def parse_notes(notebook_name, notebook_uuid):
  all_files = os.listdir(os.path.join(base_dir, f"{notebook_uuid}.qvnotebook"))
  note_dirs = [filename for filename in all_files if filename.endswith(".qvnote")]
  notes = [get_note(notebook_name, notebook_uuid, note_dir) for note_dir in note_dirs]
  return notes


def parse_notebooks(parent_name, children):
  for child in children:
    notebook_uuid = child["uuid"]

    child_metadata = read_and_parse_json(f"{notebook_uuid}.qvnotebook/meta.json")

    name_with_parent = f"{parent_name} > {child_metadata['name']}"

    notebooks.append(
      {
        "name": name_with_parent,
        "uuid": notebook_uuid,
      }
    )

    children_notebook = child.get("children")

    if children_notebook:
      parse_notebooks(name_with_parent, children_notebook)


if __name__ == "__main__":
  root = read_and_parse_json("meta.json")
  parse_notebooks("", root["children"])

  notes = []
  for notebook in notebooks:
    notes.extend(parse_notes(notebook["name"], notebook["uuid"]))

  print(json.dumps(notes, indent=2, ensure_ascii=False))
