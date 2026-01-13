"use client";

import React from "react";
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
import { Control, FieldValues, Path } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import type { Editor } from "@/components/kibo-ui/editor";
import { EditorProvider } from "@/components/kibo-ui/editor";
import { cn } from "@/lib/utils";

type TextEditorProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label?: React.ReactNode;
    description?: string;
    className?: string;
    placeholder?: string;
    limit?: number;
};

const TextEditor = <T extends FieldValues>({
    control,
    name,
    label,
    description,
    className,
    placeholder,
    limit,
}: TextEditorProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="relative">
                    {label && <FormLabel>{label}</FormLabel>}

                    <FormControl>
                        <EditorProvider
                            content={field.value ?? ""}
                            placeholder={placeholder ? placeholder : ` ${label} ...`}
                            limit={limit}
                            autofocus
                            className={cn(
                                "min-h-[200px]  rounded border bg-background p-2",
                                "min-h-screen w-full overflow-y-auto rounded-lg border bg-background p-4 ",

        "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3",
        "[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-3",
        "[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
        "[&_h4]:text-xl [&_h4]:font-medium [&_h4]:mt-4 [&_h4]:mb-2",
        "[&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-3 [&_h5]:mb-1",
        "[&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-3 [&_h6]:mb-1 [&_h6]:text-muted-foreground",
                                fieldState.invalid
                                    ? "border-destructive"
                                    : "border-muted-foreground",
                                className
                            )}
                            onUpdate={({ editor }: { editor: Editor }) => {
                                field.onChange(editor.getHTML());
                            }}
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
                        </EditorProvider>
                    </FormControl>

                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}

                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default TextEditor;
