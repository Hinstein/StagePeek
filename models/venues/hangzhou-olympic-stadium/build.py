"""Rebuild the reviewed Hangzhou shell from its frozen venue envelope."""
from pathlib import Path
import runpy
import shutil
import sys
from tempfile import TemporaryDirectory

HERE = Path(__file__).resolve().parent
TEMPLATE = HERE.parents[1] / "templates" / "m4b" / "build.py"
with TemporaryDirectory(prefix="stagepeek-hangzhou-") as output:
    sys.argv = [str(TEMPLATE), "--", str(HERE / "input.json"), output]
    runpy.run_path(str(TEMPLATE), run_name="__main__")
    for filename in ("shell.glb", "manifest.json"):
        shutil.copyfile(Path(output) / HERE.name / filename, HERE / filename)
