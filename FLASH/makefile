################################################################################
# Automatically-generated file. Do not edit!
################################################################################

#Progress monitor hint: 27
first : all
-include ../makefile.init

# This file contains definitions of environment variables used in the makefiles and .args files if exist.
-include makefile.local

RM := "$(GNU_Make_Install_DirEnv)/rm" -f

# All of the sources participating in the build are defined here
-include sources.mk
-include subdir.mk
-include src/subdir.mk
-include src/S12ZVM_system/subdir.mk
-include src/S12ZVM_system/startup_CW/subdir.mk
-include src/S12ZVM_system/peripherals/subdir.mk
-include src/FreeMASTER/src_common/subdir.mk
-include src/FreeMASTER/S12ZVM/subdir.mk
-include .metadata/.plugins/org.eclipse.cdt.make.core/subdir.mk
-include objects.mk

ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(C++_DEPS)),)
-include $(C++_DEPS)
endif
ifneq ($(strip $(ASM_DEPS)),)
-include $(ASM_DEPS)
endif
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
ifneq ($(strip $(CC_DEPS)),)
-include $(CC_DEPS)
endif
ifneq ($(strip $(ASM_UPPER_DEPS)),)
-include $(ASM_UPPER_DEPS)
endif
ifneq ($(strip $(CPP_DEPS)),)
-include $(CPP_DEPS)
endif
ifneq ($(strip $(S_DEPS)),)
-include $(S_DEPS)
endif
ifneq ($(strip $(CXX_DEPS)),)
-include $(CXX_DEPS)
endif
ifneq ($(strip $(C_UPPER_DEPS)),)
-include $(C_UPPER_DEPS)
endif
ifneq ($(strip $(S_UPPER_DEPS)),)
-include $(S_UPPER_DEPS)
endif
endif

-include ../makefile.defs

# Add inputs and outputs from these tool invocations to the build variables 
EXECUTABLES += \
Wisemay_CoolingFan_2.0.elf \

EXECUTABLES_QUOTED += \
"Wisemay_CoolingFan_2.0.elf" \

EXECUTABLES_OS_FORMAT += \
Wisemay_CoolingFan_2.0.elf \

BURNER_OUTPUT_OUTPUTS += \
Wisemay_CoolingFan_2.0.elf.s19 \

BURNER_OUTPUT_OUTPUTS_QUOTED += \
"Wisemay_CoolingFan_2.0.elf.s19" \

BURNER_OUTPUT_OUTPUTS_OS_FORMAT += \
Wisemay_CoolingFan_2.0.elf.s19 \


# All Target
all: warning-messages explicit-dependencies Wisemay_CoolingFan_2.0.elf

# Tool invocations
Wisemay_CoolingFan_2.0.elf: $(OBJS) $(USER_OBJS) ../src/S12ZVM_system/startup_CW/S12zvm.prm
	@echo 'Building target: $@'
	@echo 'Executing target #28 $@'
	@echo 'Invoking: S12Z Linker'
	"$(S12Z_ToolsDirEnv)/linker" -ArgFile"Wisemay_CoolingFan_2.args" -O"Wisemay_CoolingFan_2.0.elf"
	@echo 'Finished building target: $@'
	@echo ' '

Wisemay_CoolingFan_2.0.elf.s19: $(BBL_SRCS) $(EXECUTABLES)
	@echo 'Executing target #29 $@'
	@echo 'Invoking: S12Z Burner'
	"$(S12Z_ToolsDirEnv)/burner" -ViewHidden -WmsgFob"%f%e:%l:%k:%d:%m\n" -f="$<" -env"ABS_FILE=$(strip $(EXECUTABLES_OS_FORMAT))"
	@echo 'Finished building: $@'
	@echo ' '

# Other Targets
clean:
	-$(RM) $(S_DEPS_QUOTED) "./*/*/*/*.obj" "./*.obj" "./*/*/*.obj" "./*/*.obj"  "./*/*/*/*.d"  $(CC_DEPS_QUOTED) $(S_UPPER_DEPS_QUOTED) $(CXX_DEPS_QUOTED) $(ASM_DEPS_QUOTED) $(BURNER_OUTPUT_OUTPUTS_QUOTED) $(ASM_UPPER_DEPS_QUOTED) $(C_UPPER_DEPS_QUOTED) $(C++_DEPS_QUOTED) $(EXECUTABLES_QUOTED) "./*/*/*/*.d" "./*.d" "./*/*/*.d" "./*/*.d"  $(ProjDirPath)/FLASH/Wisemay_CoolingFan_2.0.elf
	-@echo ' '

.PHONY: all clean dependents explicit-dependencies warning-messages
.SECONDARY:

-include ../makefile.targets

explicit-dependencies: ../src/S12ZVM_system/startup_CW/S12zvm.prm 

warning-messages: 

