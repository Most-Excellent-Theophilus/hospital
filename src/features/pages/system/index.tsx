"use client";

import type { Editor} from "@/components/kibo-ui/editor";
import {
  EditorBubbleMenu,
  EditorCharacterCount,
  EditorClearFormatting,
  EditorFloatingMenu,
  EditorFormatBold,
  EditorFormatCode,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatSubscript,
  EditorFormatSuperscript,
  EditorFormatUnderline,
  EditorLinkSelector,
  EditorNodeBulletList,
  EditorNodeCode,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeHeading3,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorNodeTable,
  EditorNodeTaskList,
  EditorNodeText,
  EditorProvider,
  EditorSelector,
  EditorTableColumnAfter,
  EditorTableColumnBefore,
  EditorTableColumnDelete,
  EditorTableColumnMenu,
  EditorTableDelete,
  EditorTableFix,
  EditorTableGlobalMenu,
  EditorTableHeaderColumnToggle,
  EditorTableHeaderRowToggle,
  EditorTableMenu,
  EditorTableMergeCells,
  EditorTableRowAfter,
  EditorTableRowBefore,
  EditorTableRowDelete,
  EditorTableRowMenu,
  EditorTableSplitCell,
} from "@/components/kibo-ui/editor";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Example = () => {
  // const [content, setContent] = useState<JSONContent>({

  // });
  const [content, setContent] = useState<string>('<h1>samuel Mkamanga</h1>');


  const handleUpdate = ({ editor }: { editor: Editor }) => {
    const json = editor.getHTML();

    setContent(json);
    console.log(JSON.stringify(json));
  };

  return (



    <EditorProvider
      className={cn("h-full w-full overflow-y-auto rounded-lg border bg-background p-4 ",

        "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3",
        "[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-3",
        "[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
        "[&_h4]:text-xl [&_h4]:font-medium [&_h4]:mt-4 [&_h4]:mb-2",
        "[&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-3 [&_h5]:mb-1",
        "[&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-3 [&_h6]:mb-1 [&_h6]:text-muted-foreground"
      )}
      content={content}
      autofocus
      onUpdate={handleUpdate}
      placeholder="Start typing..."
      limit={1000}
    >
      <EditorFloatingMenu className="">
        <EditorNodeHeading1 hideName />
        <EditorNodeBulletList hideName />
        <EditorNodeQuote hideName />
        <EditorNodeCode hideName />
        <EditorNodeTable hideName />
      </EditorFloatingMenu>
      <EditorBubbleMenu>
        <EditorSelector title="Text">
          <EditorNodeText />
          <EditorNodeHeading1 />
          <EditorNodeHeading2 />
          <EditorNodeHeading3 />
          <EditorNodeBulletList />
          <EditorNodeOrderedList />
          <EditorNodeTaskList />
          <EditorNodeQuote />
          <EditorNodeCode />
        </EditorSelector>
        <EditorSelector title="Format">
          <EditorFormatBold />
          <EditorFormatItalic />
          <EditorFormatUnderline />
          <EditorFormatStrike />
          <EditorFormatCode />
          <EditorFormatSuperscript />
          <EditorFormatSubscript />
        </EditorSelector>
        <EditorLinkSelector />
        <EditorClearFormatting />
      </EditorBubbleMenu>
      <EditorTableMenu>
        <EditorTableColumnMenu>
          <EditorTableColumnBefore />
          <EditorTableColumnAfter />
          <EditorTableColumnDelete />
        </EditorTableColumnMenu>
        <EditorTableRowMenu>
          <EditorTableRowBefore />
          <EditorTableRowAfter />
          <EditorTableRowDelete />
        </EditorTableRowMenu>
        <EditorTableGlobalMenu>
          <EditorTableHeaderColumnToggle />
          <EditorTableHeaderRowToggle />
          <EditorTableDelete />
          <EditorTableMergeCells />
          <EditorTableSplitCell />
          <EditorTableFix />
        </EditorTableGlobalMenu>
      </EditorTableMenu>
      <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
      {/* <EditorCharacterCount.Characters>Charectors: </EditorCharacterCount.Characters> */}
    </EditorProvider>


  );
};

export default Example;
