################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../../../makefile.local

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS_QUOTED += \
"../src/S12ZVM_system/peripherals/adc.c" \
"../src/S12ZVM_system/peripherals/cpmu.c" \
"../src/S12ZVM_system/peripherals/gdu.c" \
"../src/S12ZVM_system/peripherals/pim.c" \
"../src/S12ZVM_system/peripherals/pmf.c" \
"../src/S12ZVM_system/peripherals/ptu.c" \
"../src/S12ZVM_system/peripherals/sci.c" \

C_SRCS += \
../src/S12ZVM_system/peripherals/adc.c \
../src/S12ZVM_system/peripherals/cpmu.c \
../src/S12ZVM_system/peripherals/gdu.c \
../src/S12ZVM_system/peripherals/pim.c \
../src/S12ZVM_system/peripherals/pmf.c \
../src/S12ZVM_system/peripherals/ptu.c \
../src/S12ZVM_system/peripherals/sci.c \

OBJS += \
./src/S12ZVM_system/peripherals/adc_c.obj \
./src/S12ZVM_system/peripherals/cpmu_c.obj \
./src/S12ZVM_system/peripherals/gdu_c.obj \
./src/S12ZVM_system/peripherals/pim_c.obj \
./src/S12ZVM_system/peripherals/pmf_c.obj \
./src/S12ZVM_system/peripherals/ptu_c.obj \
./src/S12ZVM_system/peripherals/sci_c.obj \

OBJS_QUOTED += \
"./src/S12ZVM_system/peripherals/adc_c.obj" \
"./src/S12ZVM_system/peripherals/cpmu_c.obj" \
"./src/S12ZVM_system/peripherals/gdu_c.obj" \
"./src/S12ZVM_system/peripherals/pim_c.obj" \
"./src/S12ZVM_system/peripherals/pmf_c.obj" \
"./src/S12ZVM_system/peripherals/ptu_c.obj" \
"./src/S12ZVM_system/peripherals/sci_c.obj" \

C_DEPS += \
./src/S12ZVM_system/peripherals/adc_c.d \
./src/S12ZVM_system/peripherals/cpmu_c.d \
./src/S12ZVM_system/peripherals/gdu_c.d \
./src/S12ZVM_system/peripherals/pim_c.d \
./src/S12ZVM_system/peripherals/pmf_c.d \
./src/S12ZVM_system/peripherals/ptu_c.d \
./src/S12ZVM_system/peripherals/sci_c.d \

C_DEPS_QUOTED += \
"./src/S12ZVM_system/peripherals/adc_c.d" \
"./src/S12ZVM_system/peripherals/cpmu_c.d" \
"./src/S12ZVM_system/peripherals/gdu_c.d" \
"./src/S12ZVM_system/peripherals/pim_c.d" \
"./src/S12ZVM_system/peripherals/pmf_c.d" \
"./src/S12ZVM_system/peripherals/ptu_c.d" \
"./src/S12ZVM_system/peripherals/sci_c.d" \

OBJS_OS_FORMAT += \
./src/S12ZVM_system/peripherals/adc_c.obj \
./src/S12ZVM_system/peripherals/cpmu_c.obj \
./src/S12ZVM_system/peripherals/gdu_c.obj \
./src/S12ZVM_system/peripherals/pim_c.obj \
./src/S12ZVM_system/peripherals/pmf_c.obj \
./src/S12ZVM_system/peripherals/ptu_c.obj \
./src/S12ZVM_system/peripherals/sci_c.obj \


# Each subdirectory must supply rules for building sources it contributes
src/S12ZVM_system/peripherals/adc_c.obj: ../src/S12ZVM_system/peripherals/adc.c
	@echo 'Building file: $<'
	@echo 'Executing target #8 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/peripherals/adc.args" -o "src/S12ZVM_system/peripherals/adc_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/S12ZVM_system/peripherals/%.d: ../src/S12ZVM_system/peripherals/%.c
	@echo 'Regenerating dependency file: $@'
	
	@echo ' '

src/S12ZVM_system/peripherals/cpmu_c.obj: ../src/S12ZVM_system/peripherals/cpmu.c
	@echo 'Building file: $<'
	@echo 'Executing target #9 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/peripherals/cpmu.args" -o "src/S12ZVM_system/peripherals/cpmu_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/S12ZVM_system/peripherals/gdu_c.obj: ../src/S12ZVM_system/peripherals/gdu.c
	@echo 'Building file: $<'
	@echo 'Executing target #10 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/peripherals/gdu.args" -o "src/S12ZVM_system/peripherals/gdu_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/S12ZVM_system/peripherals/pim_c.obj: ../src/S12ZVM_system/peripherals/pim.c
	@echo 'Building file: $<'
	@echo 'Executing target #11 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/peripherals/pim.args" -o "src/S12ZVM_system/peripherals/pim_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/S12ZVM_system/peripherals/pmf_c.obj: ../src/S12ZVM_system/peripherals/pmf.c
	@echo 'Building file: $<'
	@echo 'Executing target #12 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/peripherals/pmf.args" -o "src/S12ZVM_system/peripherals/pmf_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/S12ZVM_system/peripherals/ptu_c.obj: ../src/S12ZVM_system/peripherals/ptu.c
	@echo 'Building file: $<'
	@echo 'Executing target #13 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/peripherals/ptu.args" -o "src/S12ZVM_system/peripherals/ptu_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/S12ZVM_system/peripherals/sci_c.obj: ../src/S12ZVM_system/peripherals/sci.c
	@echo 'Building file: $<'
	@echo 'Executing target #14 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/peripherals/sci.args" -o "src/S12ZVM_system/peripherals/sci_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '


